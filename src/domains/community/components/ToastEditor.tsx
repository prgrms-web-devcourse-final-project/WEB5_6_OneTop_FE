"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import ToastuiEditor, {
  EditorOptions,
  EventMap,
  PreviewStyle,
} from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";


export interface EventMapping {
  onLoad: EventMap["load"];
  onChange: EventMap["change"];
  onCaretChange: EventMap["caretChange"];
  onFocus: EventMap["focus"];
  onBlur: EventMap["blur"];
  onKeydown: EventMap["keydown"];
  onKeyup: EventMap["keyup"];
  onBeforePreviewRender: EventMap["beforePreviewRender"];
  onBeforeConvertWysiwygToMarkdown: EventMap["beforeConvertWysiwygToMarkdown"];
}

export interface TuiEditorRef {
  getHTML: () => string;
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  setHTML: (html: string) => void;
  reset: () => void;
}

export type EventNames = keyof EventMapping;

export type TuiEditorProps = Omit<EditorOptions, "el"> & Partial<EventMapping> & { viewer?: boolean };

const TuiEditor = forwardRef<TuiEditorRef, TuiEditorProps>((props, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ToastuiEditor | null>(null);
  const defaultOptions = {
    initialEditType: "wysiwyg",
    usageStatistics: false,
    hideModeSwitch: true,
    placeholder: "내용을 입력하세요.",
    toolbarItems: [
      ["heading", "bold", "italic", "strike"],
      ["hr", "quote"],
      ["ul", "ol", "task", "indent", "outdent"],
      ["table", "link"],
      ["code", "codeblock"],
    ],
  }

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      return editorRef.current?.getHTML?.() || "";
    },
    getMarkdown: () => {
      return editorRef.current?.getMarkdown?.() || "";
    },
    setMarkdown: (markdown: string) => {
      editorRef.current?.setMarkdown?.(markdown);
    },
    setHTML: (html: string) => {
      editorRef.current?.setHTML?.(html);
    },
    reset: () => {
      editorRef.current?.reset?.();
    },
  }));

  useEffect(() => {
    if (divRef.current) {
      if (props.viewer) {
        editorRef.current = ToastuiEditor.factory({
            el: divRef.current,
            viewer: true,
            usageStatistics: false,
            ...props,
          }) as ToastuiEditor;
      } else {
      editorRef.current = new ToastuiEditor({
        ...defaultOptions,
        ...props,
        el: divRef.current,

        events: getInitEvents(props),
      }) as ToastuiEditor;
      }
    }

    return () => {
      editorRef.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (props.height) {
      editorRef.current?.setHeight(props.height as string | number);
    }

    if (props.previewStyle) {
      editorRef.current?.changePreviewStyle(props.previewStyle as PreviewStyle);
    }

    if (editorRef.current) {
      bindEventHandlers(editorRef.current as ToastuiEditor, props);
    }
  }, [props]);

  return <div ref={divRef}></div>;
});

TuiEditor.displayName = "TuiEditor";

function getBindingEventNames(props: TuiEditorProps) {
  return Object.keys(props)
    .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
    .filter((key) => props[key as EventNames]);
}

function bindEventHandlers(editor: ToastuiEditor, props: TuiEditorProps) {
  getBindingEventNames(props).forEach((key) => {
    const eventName = key[2].toLowerCase() + key.slice(3);

    editor.off(eventName);
    editor.on(
      eventName,
      props[key as EventNames]! as (...args: unknown[]) => void
    );
  });
}

function getInitEvents(props: TuiEditorProps) {
  return getBindingEventNames(props).reduce(
    (acc: Record<string, EventMap[keyof EventMap]>, key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);

      const handler = props[key as EventNames];
      if (handler) {
        acc[eventName] = handler as EventMap[keyof EventMap];
      }

      return acc;
    },
    {}
  );
}

export default TuiEditor;
