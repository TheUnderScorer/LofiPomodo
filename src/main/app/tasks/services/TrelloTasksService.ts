import { TaskApiService } from '../../../../shared/types/taskProviders';
import { Task, TaskSource } from '../../../../shared/types/tasks';
import { TrelloService } from '../../integrations/trello/TrelloService';
import { TaskRepository } from '../repositories/TaskRepository';
import { TrelloCard } from '../../../../shared/types/integrations/trello';
import { TaskCrudService } from './TaskCrudService';

export class TrelloTasksService implements TaskApiService {
  readonly provider = TaskSource.Trello;

  private static batchLimit = 10;

  constructor(
    private readonly trelloService: TrelloService,
    private readonly taskRepository: TaskRepository,
    private readonly taskCrudService: TaskCrudService
  ) {}

  async syncTasks(): Promise<Task[]> {
    const cards = await this.trelloService.getCards();
    const cardIds = cards.map((list) => list.id);

    const trelloTasks = await this.taskRepository.getBySource(
      TaskSource.Trello
    );

    const tasksToDelete = trelloTasks.filter(
      (task) => !cardIds.find((listId) => task.sourceId === listId)
    );

    const listsWithoutTasks = cards.filter(
      (list) => !trelloTasks.find((task) => task.sourceId === list.id)
    );

    const createdTasks = await Promise.all([
      ...listsWithoutTasks.map((list) => this.createTaskFromCard(list)),
    ]);

    if (tasksToDelete.length) {
      await this.taskRepository.delete(tasksToDelete.map((task) => task.id));
    }

    console.log(`Trello sync finished:`, {
      tasksToDelete,
      createdTasks,
      listsWithoutTasks,
    });

    return createdTasks;
  }

  async createTaskFromCard(card: TrelloCard) {
    return this.taskCrudService.createTask({
      source: TaskSource.Trello,
      title: card.name,
      description: card.desc,
      sourceId: card.id,
    });
  }
}
