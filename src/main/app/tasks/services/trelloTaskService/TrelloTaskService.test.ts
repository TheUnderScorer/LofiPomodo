import { TrelloTasksService } from './TrelloTasksService';
import { createMockProxy } from 'jest-mock-proxy';
import { TaskRepository } from '../../repositories/TaskRepository';
import {
  TrelloBoardSettings,
  TrelloCard,
  TrelloTaskMeta,
} from '../../../../../shared/types/integrations/trello';
import { v4 as uuid } from 'uuid';
import { Task, TaskSource, TaskState } from '../../../../../shared/types/tasks';
import { Subject } from 'rxjs';

describe('TrelloTasksService', () => {
  let trelloTaskService: TrelloTasksService;

  const trelloService: any = {
    boardSettings: [],
    getCards: jest.fn(),
    updateCard: jest.fn(),
  };
  const taskCrudService = {
    createTask: jest.fn(),
    tasksCompleted$: new Subject(),
    tasksUncompleted$: new Subject(),
  };
  const taskRepository = createMockProxy<TaskRepository>();

  beforeEach(() => {
    trelloService.getCards.mockClear();
    trelloService.updateCard.mockClear();
    trelloService.boardSettings = [];
    taskRepository.mockClear();
    taskCrudService.createTask.mockClear();

    trelloTaskService = new TrelloTasksService(
      trelloService,
      taskRepository,
      taskCrudService as any
    );
  });

  describe('syncTasks', () => {
    it('should sync tasks from trello', async () => {
      taskCrudService.createTask.mockImplementation((task) => task);

      const cards: Array<Partial<TrelloCard>> = [
        // Task for this card already exists
        {
          id: uuid(),
          idBoard: uuid(),
          idList: uuid(),
          desc: 'Desc 1',
          name: 'Test name 1',
        },
        {
          id: uuid(),
          idBoard: uuid(),
          idList: uuid(),
          desc: 'Desc 2',
          name: 'Test name 2',
        },
        {
          id: uuid(),
          idBoard: uuid(),
          idList: uuid(),
          desc: 'Desc 3',
          name: 'Test name 3',
        },
      ];

      const cardIdsToDelete = [cards[0].id];
      const cardIdsToCreate = [cards[1].id, cards[2].id];

      const tasks: Array<Partial<Task<TrelloTaskMeta>>> = [
        // Already existing task that has card in trello
        {
          id: uuid(),
          sourceId: cards[0].id,
        },
        // Task that no longer exists in trello
        {
          id: uuid(),
          sourceId: uuid(),
        },
        // Task that no longer exists in trello but it's completed, so it should be ignored
        {
          id: uuid(),
          sourceId: uuid(),
          state: TaskState.Completed,
        },
      ];

      taskRepository.findTasksWithoutSourceIdByState.mockResolvedValue([
        tasks[1] as Task,
      ]);
      taskRepository.getBySource.mockResolvedValue(tasks as Task[]);
      trelloService.getCards.mockResolvedValue(cards as TrelloCard[]);

      const {
        createdTasks,
        deletedTasks,
      } = await trelloTaskService.syncTasks();

      expect(createdTasks).toHaveLength(cardIdsToCreate.length);
      expect(deletedTasks).toHaveLength(cardIdsToDelete.length);

      expect(
        createdTasks!.filter((task) => cardIdsToCreate.includes(task.sourceId))
      ).toHaveLength(cardIdsToCreate.length);
    });
  });

  describe('moveTrelloCardToDoneList', () => {
    it('should move completed task to "done" list', async () => {
      const doneListId = uuid();
      const boardId = uuid();

      const task: Partial<Task<TrelloTaskMeta>> = {
        id: uuid(),
        state: TaskState.Completed,
        source: TaskSource.Trello,
        sourceId: uuid(),
        providerMeta: {
          boardId,
          orgListId: uuid(),
        },
      };

      trelloService.boardSettings = [
        {
          doneListId,
          boardId,
          listIds: [uuid(), uuid()],
        },
      ] as Array<Partial<TrelloBoardSettings>>;

      await trelloTaskService.moveTrelloCardToDoneList(task as Task);

      const callArgs = trelloService.updateCard.mock.calls[0];

      expect(callArgs[0]).toEqual({
        idList: doneListId,
        id: task.sourceId,
      });
    });
  });

  describe('moveCardBackFromDoneList', () => {
    it('should move unCompleted task back to its list', async () => {
      const doneListId = uuid();
      const boardId = uuid();
      const orgListId = uuid();

      const task: Partial<Task<TrelloTaskMeta>> = {
        id: uuid(),
        state: TaskState.Todo,
        source: TaskSource.Trello,
        sourceId: uuid(),
        providerMeta: {
          boardId,
          orgListId,
        },
      };

      trelloService.boardSettings = [
        {
          doneListId,
          boardId,
          listIds: [uuid(), uuid()],
        },
      ] as Array<Partial<TrelloBoardSettings>>;

      await trelloTaskService.moveCardBackFromDoneList(task as Task);

      const callArgs = trelloService.updateCard.mock.calls[0];

      expect(callArgs[0]).toEqual({
        idList: orgListId,
        id: task.sourceId,
      });
    });
  });
});
