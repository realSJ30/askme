export class StreamingResponse extends Response {
    constructor(res: ReadableStream<any>, init?: ResponseInit) {
        super(res as any, {
            ...init,
            headers: {
                ...init?.headers,
            },
        });
    }
}