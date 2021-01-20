import {
  SyncTasksResult,
  TaskApiService,
} from '../../../../../shared/types/taskProviders';
import { Task, TaskSource, TaskState } from '../../../../../shared/types/tasks';
import { TrelloService } from '../../../integrations/trello/TrelloService';
import { TaskRepository } from '../../repositories/TaskRepository';
import {
  TrelloCard,
  TrelloTaskMeta,
} from '../../../../../shared/types/integrations/trello';
import { TaskCrudEvents, TaskCrudService } from '../TaskCrudService';

export class TrelloTasksService implements TaskApiService {
  readonly provider = TaskSource.Trello;

  constructor(
    private readonly trelloService: TrelloService,
    private readonly taskRepository: TaskRepository,
    private readonly taskCrudService: TaskCrudService
  ) {
    taskCrudService.events.on(TaskCrudEvents.Completed, (task) =>
      this.moveTrelloCardToDoneList(task)
    );

    taskCrudService.events.on(TaskCrudEvents.UnCompleted, (task) =>
      this.moveCardBackFromDoneList(task)
    );
  }

  async syncTasks(): Promise<SyncTasksResult> {
    const cards = await this.trelloService.getCards();
    const cardIds = cards.map((list) => list.id);

    const trelloTasks = (await this.taskRepository.getBySource(
      TaskSource.Trello
    )) as Task<TrelloTaskMeta>[];

    const tasksToDelete = await this.taskRepository.findTasksWithoutSourceIdByState(
      cardIds,
      TaskState.Completed
    );

    const cardsWithoutTasks = cards.filter(
      (card) => !trelloTasks.find((task) => task.sourceId === card.id)
    );

    const createdTasks = await Promise.all([
      ...cardsWithoutTasks.map((list) => this.createTaskFromCard(list)),
    ]);

    if (tasksToDelete.length) {
      await this.taskRepository.delete(tasksToDelete.map((task) => task.id));
    }

    console.log(`Trello sync finished:`, {
      tasksToDelete,
      createdTasks,
      listsWithoutTasks: cardsWithoutTasks,
    });

    return {
      createdTasks,
      deletedTasks: tasksToDelete,
    };
  }

  async moveTrelloCardToDoneList(task: Task) {
    const { boardSettings } = this.trelloService;

    if (
      task.source !== this.provider ||
      task.state !== TaskState.Completed ||
      !task.providerMeta?.boardId ||
      !boardSettings
    ) {
      return;
    }

    const { boardId } = (task as Task<TrelloTaskMeta>).providerMeta!;

    const boardSetting = boardSettings.find(
      (setting) => setting.boardId === boardId
    );

    if (!boardSetting?.doneListId) {
      return;
    }

    await this.trelloService.updateCard({
      idList: boardSetting.doneListId,
      id: task.sourceId!,
    });
  }

  async moveCardBackFromDoneList(task: Task) {
    if (
      task.source !== this.provider ||
      !task.providerMeta?.orgListId ||
      task.state !== TaskState.Todo
    ) {
      return;
    }

    const { orgListId } = (task as Task<TrelloTaskMeta>).providerMeta!;

    if (!orgListId) {
      return;
    }

    await this.trelloService.updateCard({
      idList: orgListId,
      id: task.sourceId!,
    });
  }

  async createTaskFromCard(card: TrelloCard) {
    return this.taskCrudService.createTask<TrelloTaskMeta>({
      source: TaskSource.Trello,
      title: card.name,
      description: card.desc,
      sourceId: card.id,
      providerMeta: {
        orgListId: card.idList,
        boardId: card.idBoard,
      },
    });
  }
}
