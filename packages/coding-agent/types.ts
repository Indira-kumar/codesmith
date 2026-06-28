export type ToolFunction = (args: Record<string, unknown>) => Promise<string>;

export type ToolFunctionMap = Record<string, ToolFunction>;
