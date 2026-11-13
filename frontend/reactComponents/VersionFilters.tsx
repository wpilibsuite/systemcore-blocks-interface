// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Filters for lists of versions: by searching, by description, by date, and by tags.
 * Used by the version list, the Clean Up dialog, and the version picker.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageVersions from '../storage/versions';
import { collectTags, useTagLabel } from './VersionTags';

/** Whether the description filter shows the versions with a description, or without one. */
export type DescriptionMode = 'with' | 'without';

/**
 * How versions are filtered by when they were created: not at all, by a number of days back from
 * today, or between chosen dates.
 */
export type DateFilter = 'all' | 'days' | 'custom';

/** The i18n key of each date filter. */
const DATE_FILTER_LABEL_KEYS: Record<DateFilter, string> = {
  all: 'VERSIONS.FILTER_ANY_TIME',
  days: 'VERSIONS.FILTER_DAYS',
  custom: 'VERSIONS.FILTER_CHOOSE_DATES',
};

/**
 * Whether the days filter shows the versions created within the last number of days (counting
 * today), or the ones that are older than that. Between them, they show every version.
 */
export type DaysMode = 'within' | 'olderThan';

/** What the days filter's switch shows for each mode. */
const DAYS_MODE_SYMBOLS: Record<DaysMode, string> = {
  within: '<=',
  olderThan: '>',
};

/** The number of days that the days filter starts with. */
export const DEFAULT_FILTER_DAYS = 14;

/**
 * Whether the tag filter shows the versions with any of the selected tags, or the ones with none
 * of them.
 */
type TagMatchMode = 'with' | 'without';

type DateRange = Antd.GetProps<typeof Antd.DatePicker.RangePicker>['value'];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * How many versions are shown on each page of a list of versions. Fewer are shown while the
 * filters are shown, so that the filters, the versions, and the page controls fit in the dialog
 * without scrolling.
 */
const PAGE_SIZE = 10;
const PAGE_SIZE_WITH_FILTERS_SHOWN = 5;

/** Filters that can be set when the filters are reset, for example by the Clean Up dialog. */
export type InitialVersionFilters = {
  /** Whether only the versions with (or without) a description are shown. */
  onlyDescription?: boolean,
  descriptionMode?: DescriptionMode,
  dateFilter?: DateFilter,
  daysMode?: DaysMode,
  days?: number,
};

export type VersionFilters = {
  /** The versions that the filters show, in the same order as the versions given. */
  filteredVersions: storageVersions.VersionInfo[],
  isFiltered: boolean,
  /** The page of the filtered versions that is shown, starting at 1. */
  page: number,
  setPage: (page: number) => void,
  /** How many versions to show on each page, which depends on whether the filters are shown. */
  pageSize: number,
  /** The filtered versions on the page that is shown. */
  pageVersions: storageVersions.VersionInfo[],
  clearFilters: () => void,
  /**
   * Sets the filters to the given ones (or clears them), shows or hides them, and goes back to
   * the first page.
   */
  reset: (filtersOpen: boolean, initial?: InitialVersionFilters) => void,
  /**
   * Renders the Filter button, which shows or hides the filters, and, when the versions are
   * filtered, how many are shown. That stays when the filters are hidden, so it is clear why
   * versions are missing.
   */
  renderFilters: () => React.JSX.Element,
  /** Renders the page controls, if the filtered versions don't fit on one page. */
  renderPagination: () => React.JSX.Element | null,
};

/**
 * Filters the given versions, and keeps track of the page of them that is shown. Changing a
 * filter goes back to the first page, since the versions change. Showing or hiding the filters
 * changes the page size, but keeps the same version at the top of the page.
 */
export function useVersionFilters(
    versions: storageVersions.VersionInfo[]): VersionFilters {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const tagLabel = useTagLabel();
  const [searchText, setSearchText] = React.useState('');
  // Whether only the versions with (or, depending on descriptionMode, without) a description are
  // shown. The mode is kept when the checkbox is unchecked.
  const [onlyDescription, setOnlyDescription] = React.useState(false);
  const [descriptionMode, setDescriptionMode] = React.useState<DescriptionMode>('with');
  const [dateFilter, setDateFilter] = React.useState<DateFilter>('all');
  const [daysMode, setDaysMode] = React.useState<DaysMode>('within');
  const [days, setDays] = React.useState(DEFAULT_FILTER_DAYS);
  const [customRange, setCustomRange] = React.useState<DateRange>(null);
  const [tagFilter, setTagFilter] = React.useState<string[]>([]);
  const [tagMatchMode, setTagMatchMode] = React.useState<TagMatchMode>('with');
  // The filters are hidden until the user asks for them, so the list isn't intimidating.
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const pageSize = filtersOpen ? PAGE_SIZE_WITH_FILTERS_SHOWN : PAGE_SIZE;

  const allTags = collectTags(versions);

  // A tag that no version has anymore (for example, because versions were deleted) can't be used
  // to filter.
  React.useEffect(() => {
    setTagFilter(f => f.every(tag => allTags.includes(tag))
        ? f : f.filter(tag => allTags.includes(tag)));
  }, [allTags.join('\n')]);

  /**
   * Returns the times between which versions are shown, either of which is null if there is no
   * such limit.
   */
  const getDateLimits = (): [number | null, number | null] => {
    if (dateFilter === 'custom') {
      return [
        customRange?.[0] ? customRange[0].startOf('day').valueOf() : null,
        customRange?.[1] ? customRange[1].endOf('day').valueOf() : null,
      ];
    }
    if (dateFilter === 'days') {
      // The last number of days counts today, so the last 1 day is today.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const start = startOfToday.getTime() - (days - 1) * DAY_MS;
      return daysMode === 'within' ? [start, null] : [null, start - 1];
    }
    return [null, null];
  };

  const normalizedSearchText = searchText.trim().toLowerCase();
  const isFiltered = normalizedSearchText !== '' || onlyDescription ||
      dateFilter !== 'all' || tagFilter.length > 0;

  const reset = (open: boolean, initial: InitialVersionFilters = {}): void => {
    setSearchText('');
    setOnlyDescription(initial.onlyDescription ?? false);
    setDescriptionMode(initial.descriptionMode ?? 'with');
    setDateFilter(initial.dateFilter ?? 'all');
    setDaysMode(initial.daysMode ?? 'within');
    setDays(initial.days ?? DEFAULT_FILTER_DAYS);
    setCustomRange(null);
    setTagFilter([]);
    setTagMatchMode('with');
    setFiltersOpen(open);
    setPage(1);
  };

  const clearFilters = (): void => reset(filtersOpen);

  const [dateStart, dateEnd] = getDateLimits();
  const filteredVersions = versions.filter(version => {
    const createdAt = new Date(version.createdAt).getTime();
    return (dateStart === null || createdAt >= dateStart) &&
        (dateEnd === null || createdAt <= dateEnd) &&
        (!onlyDescription || (descriptionMode === 'with') === (version.description !== '')) &&
        (tagFilter.length === 0 ||
            (tagMatchMode === 'with') === tagFilter.some(tag => version.tags.includes(tag))) &&
        // Tags are searched as they are shown, so built-in tags match in the user's language.
        (!normalizedSearchText ||
            version.description.toLowerCase().includes(normalizedSearchText) ||
            version.notes.toLowerCase().includes(normalizedSearchText) ||
            version.tags.some(tag => tagLabel(tag).toLowerCase().includes(normalizedSearchText)));
  });

  /** Changes a filter, and goes back to the first page. */
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T): void => {
    setter(value);
    setPage(1);
  };

  const toggleTagFilter = (tag: string, checked: boolean): void => {
    setTagFilter(f => checked ? [...f, tag] : f.filter(t => t !== tag));
    setPage(1);
  };

  /**
   * Renders a line of the filters, with its label. The label is at the top of content that is
   * more than one line high.
   */
  const renderFilterLine = (
      labelKey: string, content: React.ReactNode,
      align: 'center' | 'start' = 'center'): React.JSX.Element => (
    <Antd.Space size={8} wrap align={align}>
      <Antd.Typography.Text type="secondary">{t(labelKey)}</Antd.Typography.Text>
      {content}
    </Antd.Space>
  );

  /**
   * Renders a date choice that has inputs: its radio button, with the inputs next to it instead of
   * in its label, so that clicking them doesn't click the radio button. The inputs are dimmed
   * when the choice isn't chosen, and pressing on them chooses it.
   */
  const renderDateChoice = (choice: DateFilter, inputs: React.ReactNode): React.JSX.Element => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Antd.Radio value={choice} aria-label={t(DATE_FILTER_LABEL_KEYS[choice])} />
      <div
        onMouseDown={() => dateFilter !== choice && changeFilter(setDateFilter)(choice)}
        onFocus={() => dateFilter !== choice && changeFilter(setDateFilter)(choice)}
        style={{
          opacity: dateFilter === choice ? 1 : 0.5, transition: 'opacity 0.2s',
          // Ant's radio group sets font-size to 0 (to remove the gaps between radio buttons), and
          // only its radio buttons set it back, so text next to them would be invisible.
          fontSize: token.fontSize,
        }}
      >
        {inputs}
      </div>
    </div>
  );

  const renderFilterPanel = (): React.JSX.Element => (
    // The box shows which controls appeared when the Filter button was clicked.
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: 12,
      border: `1px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    }}>
      <Antd.Input
        allowClear
        size="small"
        placeholder={t('VERSIONS.SEARCH_PLACEHOLDER')}
        value={searchText}
        onChange={(e) => changeFilter(setSearchText)(e.target.value)}
      />
      {/* A checkbox with a sentence, rather than a choice that includes "any", since the other
          filters (such as the search) still apply when it is unchecked. The switch is outside the
          checkbox's label, so clicking it doesn't also click the checkbox; using it checks the
          checkbox, and the rest of the sentence clicks the checkbox like a label does. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Antd.Checkbox
          checked={onlyDescription}
          onChange={(e) => changeFilter(setOnlyDescription)(e.target.checked)}
          aria-label={t(descriptionMode === 'with'
              ? 'VERSIONS.FILTER_ONLY_WITH_DESCRIPTION' : 'VERSIONS.FILTER_ONLY_WITHOUT_DESCRIPTION')}
        />
        <span
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest('.ant-switch')) {
              changeFilter(setOnlyDescription)(!onlyDescription);
            }
          }}
          style={{
            cursor: 'pointer', userSelect: 'none',
            opacity: onlyDescription ? 1 : 0.5, transition: 'opacity 0.2s',
          }}
        >
          <I18Next.Trans
            i18nKey="VERSIONS.FILTER_ONLY_DESCRIPTION_SENTENCE"
            components={{
              mode: (
                <Antd.Switch
                  size="small"
                  checked={descriptionMode === 'without'}
                  onChange={(checked) => {
                    setDescriptionMode(checked ? 'without' : 'with');
                    changeFilter(setOnlyDescription)(true);
                  }}
                  checkedChildren={t('VERSIONS.FILTER_WITHOUT')}
                  unCheckedChildren={t('VERSIONS.FILTER_WITH')}
                  style={{ marginInline: 4 }}
                />
              ),
            }}
          />
        </span>
      </div>
      {renderFilterLine('VERSIONS.FILTER_DATE', (
        // Every choice and its inputs are always shown, so nothing appears or disappears when the
        // choice changes. The inputs of the choices that aren't chosen are dimmed, and using one
        // of them chooses it.
        <Antd.Radio.Group
          value={dateFilter}
          onChange={(e) => changeFilter(setDateFilter)(e.target.value)}
          style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
        >
          <Antd.Radio value="all">{t('VERSIONS.FILTER_ANY_TIME')}</Antd.Radio>
          {renderDateChoice('days', (
            // A sentence, so each language can put the switch and the number where they belong.
            // It is a flex box so that the switch, the number, and the words are vertically
            // centered with each other and with the radio button. The count picks the plural form
            // of "days".
            <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'pre' }}>
              <I18Next.Trans
                i18nKey="VERSIONS.FILTER_DAYS_SENTENCE"
                count={days}
                components={{
                  mode: (
                    // The switch shows > (older than) or <= (within the last), which are short and
                    // the same in every language. The words are in the tooltip and for screen
                    // readers.
                    <Antd.Tooltip
                      title={t(daysMode === 'olderThan'
                          ? 'VERSIONS.FILTER_OLDER_THAN' : 'VERSIONS.FILTER_WITHIN_LAST')}
                    >
                      <Antd.Switch
                        size="small"
                        checked={daysMode === 'olderThan'}
                        onChange={(checked) =>
                            changeFilter(setDaysMode)(checked ? 'olderThan' : 'within')}
                        checkedChildren={DAYS_MODE_SYMBOLS.olderThan}
                        unCheckedChildren={DAYS_MODE_SYMBOLS.within}
                        aria-label={t(daysMode === 'olderThan'
                            ? 'VERSIONS.FILTER_OLDER_THAN' : 'VERSIONS.FILTER_WITHIN_LAST')}
                        style={{ marginInlineEnd: 4 }}
                      />
                    </Antd.Tooltip>
                  ),
                  count: (
                    <Antd.InputNumber
                      size="small"
                      min={1}
                      precision={0}
                      value={days}
                      onChange={(value) => changeFilter(setDays)(value ?? DEFAULT_FILTER_DAYS)}
                      style={{ width: 64, marginInline: 4 }}
                    />
                  ),
                }}
              />
            </span>
          ))}
          {renderDateChoice('custom', (
            <Antd.DatePicker.RangePicker
              size="small"
              value={customRange}
              onChange={changeFilter(setCustomRange)}
              allowEmpty={[true, true]}
            />
          ))}
        </Antd.Radio.Group>
      ), 'start')}
      {allTags.length > 0 && renderFilterLine('VERSIONS.FILTER_TAGS', (
        <Antd.Space size={4} wrap>
          {/* Like the description filter's switch, it says which side is shown, so there is no
              need for a way to invert the filter. */}
          <Antd.Tooltip title={t('VERSIONS.TAG_MATCH_MODE_TOOLTIP')}>
            <Antd.Switch
              size="small"
              checked={tagMatchMode === 'without'}
              onChange={(checked) => changeFilter(setTagMatchMode)(checked ? 'without' : 'with')}
              checkedChildren={t('VERSIONS.FILTER_WITHOUT')}
              unCheckedChildren={t('VERSIONS.FILTER_WITH')}
              aria-label={t(tagMatchMode === 'without'
                  ? 'VERSIONS.FILTER_TAGS_WITHOUT' : 'VERSIONS.FILTER_TAGS_WITH')}
              style={{ marginRight: 8 }}
            />
          </Antd.Tooltip>
          {allTags.map(tag => (
            <Antd.Tag.CheckableTag
              key={tag}
              checked={tagFilter.includes(tag)}
              onChange={(checked) => toggleTagFilter(tag, checked)}
              style={{ border: `1px solid ${token.colorBorder}` }}
            >
              {tagLabel(tag)}
            </Antd.Tag.CheckableTag>
          ))}
        </Antd.Space>
      ))}
    </div>
  );

  const renderFilters = (): React.JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      <Antd.Space size={8} wrap>
        <Antd.Button
          size="small"
          icon={<FilterOutlined />}
          type={filtersOpen ? 'primary' : 'default'}
          onClick={toggleFiltersOpen}
        >
          {t('VERSIONS.FILTER')}
        </Antd.Button>
        {isFiltered && (
          <Antd.Space size={4}>
            <Antd.Typography.Text type="secondary">
              {t('VERSIONS.FILTER_SHOWING',
                  { count: filteredVersions.length, total: versions.length })}
            </Antd.Typography.Text>
            <Antd.Button size="small" type="link" onClick={clearFilters}>
              {t('VERSIONS.FILTER_CLEAR')}
            </Antd.Button>
          </Antd.Space>
        )}
      </Antd.Space>
      {filtersOpen && renderFilterPanel()}
    </div>
  );

  // If versions were deleted or filtered out, the page might not exist anymore, so the last page
  // is shown instead.
  const shownPage = Math.min(page, Math.max(1, Math.ceil(filteredVersions.length / pageSize)));

  /**
   * Shows or hides the filters, which changes the page size. The page that has the version that
   * was at the top of the page is shown, so that version is still on the page.
   */
  const toggleFiltersOpen = (): void => {
    const newPageSize = filtersOpen ? PAGE_SIZE : PAGE_SIZE_WITH_FILTERS_SHOWN;
    const topIndex = (shownPage - 1) * pageSize;
    setPage(Math.floor(topIndex / newPageSize) + 1);
    setFiltersOpen(!filtersOpen);
  };

  const pageVersions = filteredVersions.slice((shownPage - 1) * pageSize, shownPage * pageSize);

  const renderPagination = (): React.JSX.Element | null =>
    filteredVersions.length > pageSize ? (
      <Antd.Pagination
        style={{ marginTop: 12, justifyContent: 'flex-end' }}
        size="small"
        current={shownPage}
        pageSize={pageSize}
        total={filteredVersions.length}
        onChange={setPage}
        showSizeChanger={false}
        showTotal={(total, range) =>
            t('PAGINATION_ITEMS', { range0: range[0], range1: range[1], total })}
      />
    ) : null;

  return {
    filteredVersions, isFiltered, page: shownPage, setPage, pageSize, pageVersions, clearFilters,
    reset, renderFilters, renderPagination,
  };
}
