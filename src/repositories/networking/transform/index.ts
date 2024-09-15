import { Transform, TransformCallback, TransformOptions } from 'stream';

export class DelimiterTransform extends Transform {
  private delimiter: Buffer;
  private buffer: Buffer;

  public constructor(delimiter: Buffer | number, options?: TransformOptions) {
    super({
      ...options,
      readableObjectMode: true, // Emit raw data chunks
    });

    this.delimiter = Buffer.isBuffer(delimiter) ? delimiter : Buffer.from([delimiter]);
    this.buffer = Buffer.alloc(0);
  }

  /**
   * Transforms the data by splitting it at the delimiter.
   * @param chunk - The chunk of data to transform.
   * @param encoding - The encoding of the chunk.
   * @param callback - The callback to call when the transformation is complete.
   */
  _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    // Concatenate new chunk with any previously buffered data
    this.buffer = Buffer.concat([this.buffer, chunk]);

    let delimiterIndex: number;
    while ((delimiterIndex = this.buffer.indexOf(this.delimiter)) !== -1) {
      const data = this.buffer.slice(0, delimiterIndex);
      this.buffer = this.buffer.slice(delimiterIndex + this.delimiter.length);
      this.push(data);
    }

    callback();
  }

  /**
   * Flushes any remaining data.
   * @param callback - The callback to call when the flush is complete.
   */
  _flush(callback: TransformCallback): void {
    if (this.buffer.length > 0) {
      this.push(this.buffer);
    }
    callback();
  }
}