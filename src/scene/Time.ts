export class Time {
  private static deltaTime: number = 0;

  public static setDeltaTime(delta: number) {
    this.deltaTime = delta;
  }

  public static get DeltaTime() {
    return this.deltaTime;
  }
}
