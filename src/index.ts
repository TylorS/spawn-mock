import { SpawnOptions, ChildProcess } from 'child_process';
import { MockWritable, MockReadable } from 'stdio-mock';

export function mockSpawn(callback: (childProcess: MockChildProcess) => any) {
  return function spawn(
    cmd: string,
    args: Array<string>,
    options?: SpawnOptions): MockChildProcess
  {
    const childProcess = new MockChildProcess(cmd, args, options);

    Promise.resolve(callback).then(cb => cb(childProcess));

    return childProcess;
  };
}

const NOT_DEFINED_MESSAGE = 'The behavior of this method has not yet been defined';

let PID = 1000;

function newPid(): number {
  return ++PID;
}

export class MockChildProcess extends MockWritable implements ChildProcess {
  public stdin: MockWritable;
  public stdout: MockReadable;
  public stderr: MockReadable;

  public stdio: [MockWritable, MockReadable, MockReadable];

  public pid: number = newPid();

  public connected: boolean = true;

  public cmd: string;
  public args: Array<string>;
  public options: SpawnOptions | undefined;

  constructor(cmd: string, args: Array<string>, options?: SpawnOptions) {
    super();

    this.cmd = cmd;
    this.args = args;
    this.options = options;

    const stdin = new MockWritable();
    const stdout = new MockReadable();
    const stderr = new MockReadable();

    this.stdin = stdin;
    this.stdout = stdout;
    this.stderr = stderr;

    this.stdio = [stdin, stdout, stderr];
  }

  public end() {
    if (!this.connected) return;

    this.connected = false;

    this.stdin.end();
    this.stdout.end();
    this.stderr.end();

    return super.end();
  }

  public disconnect() {
    this.end();
    this.emit('disconnect');
  }

  public kill(signal = 'SIGTERM', code = 0) {
    this.end();
    this.emit('close', code, signal);
  }

  public send(message: any) {
    if (!this.connected) return false;

    this.emit('message', message);

    return true;
  }

  public unref() {
    console.log(NOT_DEFINED_MESSAGE);
  }

  public ref() {
    console.log(NOT_DEFINED_MESSAGE);
  }
}