import * as assert from 'assert';
import { mockSpawn, MockChildProcess } from '../src';

const noop = () => void 0;

describe('mockSpawn', function () {
  it('is a function', () => {
    assert.strictEqual(typeof mockSpawn, 'function');
  });

  it('returns a spawn function', () => {
    assert.strictEqual(typeof mockSpawn(noop), 'function');
  });

  describe('spawn', () => {
    it('returns a child process', () => {
      const spawn = mockSpawn(noop);
      const cp = spawn('git', ['log']);

      assert.strictEqual(typeof cp.on, 'function');
      assert.strictEqual(typeof cp.stdin.on, 'function');
      assert.strictEqual(typeof cp.stdout.on, 'function');
      assert.strictEqual(typeof cp.stderr.on, 'function');
    });
  });

  describe('with callback', () => {
    it('allows simulating events', (done) => {
      const spawn = mockSpawn(mockChildProcess => {
        mockChildProcess.stdout.write(...mockChildProcess.args);
        mockChildProcess.end();
      });

      const expected = 'Hello, world';

      const cp = spawn('echo', [expected]);

      cp.stdout.on('data', (data: string) => {;
        assert.strictEqual(data, expected);
        done();
      });
    });
  });
});
