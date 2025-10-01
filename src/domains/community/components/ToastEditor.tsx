"use client";

import { useEffect, useRef } from "react";
import ToastuiEditor, { EditorOptions, EventMap, PreviewStyle } from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

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

export type EventNames = keyof EventMapping;

export type TuiEditorProps = Omit<EditorOptions, "el"> & Partial<EventMapping>;

export default function TuiEditor(props: TuiEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ToastuiEditor | null>(null);

  useEffect(() => {
    if (divRef.current) {
      editorRef.current = new ToastuiEditor({
        ...props,
        el: divRef.current,
        usageStatistics: false,
        events: getInitEvents(props),
      });
    }
  }, []);

  useEffect(() => {
    if (props.height) {
      editorRef.current?.setHeight(props.height as string | number);
    }

    if (props.previewStyle) {
      editorRef.current?.changePreviewStyle(props.previewStyle as PreviewStyle);
    }

    if (editorRef.current) {
      bindEventHandlers(editorRef.current, props);
    }
  }, [props]);
  return <div ref={divRef}></div>;
}

function getBindingEventNames(props: TuiEditorProps) {
  return Object.keys(props)
    .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
    .filter((key) => props[key as EventNames]);
}

function bindEventHandlers(editor: ToastuiEditor, props: TuiEditorProps) {
  getBindingEventNames(props).forEach((key) => {
    const eventName = key[2].toLowerCase() + key.slice(3);

    editor.off(eventName);
    editor.on(eventName, props[key as EventNames]! as (...args: unknown[]) => void);
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
