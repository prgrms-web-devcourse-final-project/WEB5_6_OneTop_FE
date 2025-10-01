// Ambient module to bridge types for '@toast-ui/editor' under TS "bundler" resolution.
// Defines minimal surface used in our code to avoid TS7016 while keeping imports unchanged.
declare module '@toast-ui/editor' {
  export type EventMap = Record<string, (...args: unknown[]) => void> & {
    load?: () => void;
    change?: () => void;
    caretChange?: () => void;
    focus?: () => void;
    blur?: () => void;
    keydown?: (ev: KeyboardEvent) => void;
    keyup?: (ev: KeyboardEvent) => void;
    beforePreviewRender?: () => void;
    beforeConvertWysiwygToMarkdown?: () => void;
  };

  export type PreviewStyle = 'tab' | 'vertical' | 'none' | (string & {});

  export type EditorOptions = {
    el: HTMLElement;
    initialValue?: string;
    initialEditType?: 'markdown' | 'wysiwyg' | (string & {});
    previewStyle?: PreviewStyle;
    height?: string | number;
    usageStatistics?: boolean;
    events?: Partial<EventMap>;
    [key: string]: unknown;
  };

  class Editor {
    constructor(options: EditorOptions);
    setHeight(height: string | number): void;
    changePreviewStyle(style: PreviewStyle): void;
    on(eventName: string, handler: EventMap[keyof EventMap]): void;
    off(eventName: string, handler?: EventMap[keyof EventMap]): void;
  }

  export default Editor;
}


