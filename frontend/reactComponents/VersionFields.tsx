// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview The fields for a version's description, tags, and notes, for creating or editing
 * a version.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import { VersionTagsSelect } from './VersionTags';

/** A version's description, tags, and notes, as they are being edited. */
export type VersionFieldValues = {
  description: string,
  tags: string[],
  notes: string,
};

export const EMPTY_VERSION_FIELD_VALUES: VersionFieldValues = {
  description: '',
  tags: [],
  notes: '',
};

/** The type of the ref to the description. */
export type DescriptionRef = Antd.GetRef<typeof Antd.Input.TextArea>;

interface VersionFieldsProps {
  value: VersionFieldValues;
  onChange: (value: VersionFieldValues) => void;
  /** Tags that are offered as choices, for example the tags of the project's other versions. */
  knownTags: string[];
  /** Set to the description, so that it can be focused when the dialog showing it opens. */
  descriptionRef?: React.Ref<DescriptionRef>;
  /**
   * Called when Enter is pressed in the description, instead of adding a new line. Shift+Enter
   * still adds a new line.
   */
  onDescriptionEnter?: () => void;
}

/** Lets the user enter a version's description, tags, and notes. All of them are optional. */
export function VersionFields(props: VersionFieldsProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const change = (changes: Partial<VersionFieldValues>): void =>
      props.onChange({ ...props.value, ...changes });
  return (
    <Antd.Space orientation="vertical" style={{ width: '100%' }}>
      <Antd.Input.TextArea
        ref={props.descriptionRef}
        autoSize={{ minRows: 1, maxRows: 3 }}
        value={props.value.description}
        placeholder={t('VERSIONS.DESCRIPTION_PLACEHOLDER')}
        onChange={(e) => change({ description: e.target.value })}
        onKeyDown={(e) => {
          if (props.onDescriptionEnter && e.key === 'Enter' && !e.shiftKey &&
              !e.nativeEvent.isComposing) {
            e.preventDefault();
            props.onDescriptionEnter();
          }
        }}
      />
      <VersionTagsSelect
        value={props.value.tags}
        onChange={(tags) => change({ tags })}
        knownTags={props.knownTags}
      />
      <Antd.Input.TextArea
        rows={4}
        value={props.value.notes}
        placeholder={t('VERSIONS.NOTES_PLACEHOLDER')}
        onChange={(e) => change({ notes: e.target.value })}
      />
    </Antd.Space>
  );
}
