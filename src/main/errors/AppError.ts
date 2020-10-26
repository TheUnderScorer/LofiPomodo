export interface AppErrorParams {
  title?: string;
  name?: string;
}

export class AppError extends Error {
  readonly title?: string;

  constructor(message: string, { title, name }: AppErrorParams = {}) {
    super(message);

    this.title = title;

    if (name) {
      this.name = name;
    }
  }

  static fromError(error: Error, params: AppErrorParams = {}) {
    if (error instanceof AppError) {
      return error;
    }

    return new AppError(error.message, params);
  }
}
