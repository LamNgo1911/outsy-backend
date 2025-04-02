export class Result<T> {
  private constructor(
    private readonly success: boolean,
    private readonly data?: T,
    private readonly error?: string,
    private readonly statusCode: number = 200
  ) {}

  public static success<T>(data: T, statusCode: number = 200): Result<T> {
    return new Result<T>(true, data, undefined, statusCode);
  }

  public static error<T>(error: string, statusCode: number = 500): Result<T> {
    return new Result<T>(false, undefined, error, statusCode);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }

  public getData(): T | undefined {
    return this.data;
  }

  public getError(): string | undefined {
    return this.error;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public toResponse(): { statusCode: number; body: any } {
    if (this.isSuccess()) {
      return {
        statusCode: this.statusCode,
        body: {
          success: true,
          data: this.data,
        },
      };
    }

    return {
      statusCode: this.statusCode,
      body: {
        success: false,
        error: this.error,
      },
    };
  }
}
