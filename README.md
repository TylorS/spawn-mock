# spawn-mock

> Simple mock for child_process.spawn

This is a basic mock for child_process.spawn built on top of
[`stdio-mock`](https://github.com/TylorS/stdio-mock), if you wish to use this
library, it will likely be very helpful to learn its API for `MockReadable` and
`MockWritable`.

## Let me have it!
```sh
npm install --save spawn-mock
```

## API

#### `mockSpawn(callback: (mockChildProcess: MockChildProcess) => any): Spawn`

The only function exported by this library takes a callback that allows you to
imperatively call methods on to "mock" an actual called child process.

**Example:**

```typescript
import { mockSpawn } from 'spawn-mock';

const spawn = mockSpawn(function (cp: MockChildProcess) {
  // the command (cmd) and the arguments (args) that the returned function
  // has bene called wth
  const { cmd, args } = cp;

  // write the arguments to the standard output
  cp.stdout.write(args.join(' '));

  // end the child process
  cp.end();
})

const cp = spawn('echo', ['hello']);

cp.stdout.on('data', data => console.log(data.toString())) // 'hello'

// left as an exercise for the reader ;)
```

## Types

#### `Spawn`

```typescript
export type Spawn =
  (cmd: string, args: string[], options?: SpawnOptions | undefined) => MockChildProcess
```

#### `MockChildProcess`
```typescript
import { SpawnOptions, ChildProcess } from 'child_process';
import { MockWritable, MockReadable } from 'stdio-mock';

export declare class MockChildProcess extends MockWritable implements ChildProcess {
    stdin: MockWritable;
    stdout: MockReadable;
    stderr: MockReadable;
    stdio: [MockWritable, MockReadable, MockReadable];
    pid: number;
    connected: boolean;
    cmd: string;
    args: Array<string>;
    options: SpawnOptions | undefined;

    constructor(cmd: string, args: Array<string>, options?: SpawnOptions);

    end(): void;
    disconnect(): void;
    kill(signal?: string, code?: number): void;
    send(message: any): boolean;
    unref(): void;
    ref(): void;
}
```