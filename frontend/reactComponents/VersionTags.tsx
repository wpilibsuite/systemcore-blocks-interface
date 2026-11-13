// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Shows and edits the tags of project versions.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageVersions from '../storage/versions';

/** The i18n key of each tag that is added automatically. Those tags are saved untranslated. */
const BUILT_IN_TAG_KEYS: {[tag: string]: string} = {
  [storageVersions.DEPLOYED_TAG]: 'VERSIONS.TAG_DEPLOYED',
  [storageVersions.DOWNLOADED_TAG]: 'VERSIONS.TAG_DOWNLOADED',
};

/** The theme colors that a tag can be shown in. */
export type TagStatus = 'success' | 'error' | 'warning' | 'info';

/** The theme colors of each tag that is added automatically. Other tags use the default colors. */
const BUILT_IN_TAG_STATUSES: {[tag: string]: TagStatus} = {
  [storageVersions.DEPLOYED_TAG]: 'info',
};

/** Returns a function that returns the text to show for a tag. */
export function useTagLabel(): (tag: string) => string {
  const {t} = I18Next.useTranslation();
  return (tag: string) => tag in BUILT_IN_TAG_KEYS ? t(BUILT_IN_TAG_KEYS[tag]) : tag;
}

/** Returns the style of a tag shown in the given theme colors, or undefined for the defaults. */
export function getStatusTagStyle(
    token: Antd.GlobalToken, status: TagStatus | undefined): React.CSSProperties | undefined {
  switch (status) {
    case 'success':
      return { color: token.colorSuccessText, background: token.colorSuccessBg,
          borderColor: token.colorSuccessBorder };
    case 'error':
      return { color: token.colorErrorText, background: token.colorErrorBg,
          borderColor: token.colorErrorBorder };
    case 'warning':
      return { color: token.colorWarningText, background: token.colorWarningBg,
          borderColor: token.colorWarningBorder };
    case 'info':
      return { color: token.colorInfoText, background: token.colorInfoBg,
          borderColor: token.colorInfoBorder };
    default:
      return undefined;
  }
}

/** Returns a function that returns the style to show a version's tag in. */
function useTagStyle(): (tag: string) => React.CSSProperties {
  const { token } = Antd.theme.useToken();
  return (tag: string) => ({
    marginInlineEnd: 4,
    ...getStatusTagStyle(token, BUILT_IN_TAG_STATUSES[tag]),
  });
}

/** Returns all of the tags of the given versions, sorted. */
export function collectTags(versions: storageVersions.VersionInfo[]): string[] {
  return [...new Set(versions.flatMap(version => version.tags))].sort((a, b) => a.localeCompare(b));
}

/** Shows the tags of a version. */
export function VersionTagList(props: { tags: string[] }): React.JSX.Element {
  const tagLabel = useTagLabel();
  const tagStyle = useTagStyle();
  return (
    <>
      {props.tags.map(tag => (
        <Antd.Tag key={tag} style={tagStyle(tag)}>
          {tagLabel(tag)}
        </Antd.Tag>
      ))}
    </>
  );
}

interface VersionTagsSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Tags that are offered as choices, for example the tags of the project's other versions. */
  knownTags: string[];
}

/**
 * Lets the user choose a version's tags, either from the known tags or by typing new ones. The
 * system tags (such as "deployed") can't be added or removed: the ones in value are kept, and
 * the others aren't offered. Typing a system tag's name, or its translation, doesn't add a tag
 * that looks like it.
 */
export function VersionTagsSelect(props: VersionTagsSelectProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const tagLabel = useTagLabel();
  const tagStyle = useTagStyle();
  const lockedTags = props.value.filter(storageVersions.isSystemTag);
  const systemTagNames = new Set(storageVersions.SYSTEM_TAGS.flatMap(
      tag => [tag.toLowerCase(), tagLabel(tag).toLowerCase()]));
  const isAllowed = (tag: string): boolean => !systemTagNames.has(tag.trim().toLowerCase());
  const choices = [...new Set([...lockedTags, ...props.knownTags.filter(isAllowed)])];

  const handleChange = (tags: string[]): void => {
    // Removing a locked tag (for example, with backspace) puts it back.
    props.onChange(storageVersions.normalizeTags([...lockedTags, ...tags.filter(isAllowed)]));
  };

  return (
    <Antd.Select
      mode="tags"
      style={{ width: '100%' }}
      value={props.value}
      placeholder={t('VERSIONS.TAGS_PLACEHOLDER')}
      onChange={handleChange}
      options={choices.map(tag => ({
        value: tag,
        label: tagLabel(tag),
        // A locked tag can't be unselected in the list.
        disabled: storageVersions.isSystemTag(tag),
      }))}
      tagRender={({ value, label, closable, onClose }) => {
        const locked = storageVersions.isSystemTag(String(value));
        return (
          <Antd.Tooltip title={locked ? t('VERSIONS.SYSTEM_TAG_TOOLTIP') : undefined}>
            <Antd.Tag
              closable={closable && !locked}
              onClose={onClose}
              onMouseDown={(e) => e.preventDefault()}
              style={tagStyle(String(value))}
            >
              {label}
            </Antd.Tag>
          </Antd.Tooltip>
        );
      }}
      tokenSeparators={[',']}
    />
  );
}
