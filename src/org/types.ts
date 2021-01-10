import { Parent, Node, Literal } from 'unist';

// SPEC: The paragraph is the unit of measurement. An element defines
// syntactical parts that are at the same level as a paragraph,
// i.e. which cannot contain or be included in a paragraph. An object
// is a part that could be included in an element. Greater elements
// are all parts that can contain an element.
export interface GreaterElement extends Parent {
  contentsBegin: number;
  contentsEnd: number;
  children: Array<GreaterElementType | ElementType>;
}
export interface Element extends Parent {
  contentsBegin?: number;
  contentsEnd?: number;
  children: ObjectType[];
}
export interface RecursiveObject extends Object {
  contentsBegin?: number;
  contentsEnd?: number;
  children: ObjectType[];
}
export interface Object extends Node {}

export type GreaterElementType =
  | OrgData
  | Headline
  | PropertyDrawer
  | Section
  | Drawer
  | List
  | Item
  | QuoteBlock
  | VerseBlock
  | CenterBlock
  | SpecialBlock
  | FootnoteDefinition
  | Table;
export type ElementType =
  | Planning
  | NodeProperty
  | CommentBlock
  | SrcBlock
  | ExampleBlock
  | ExportBlock
  | Keyword
  | TableRow
  | Comment
  | FixedWidth
  | Clock
  | LatexEnvironment
  | HorizontalRule
  | DiarySexp
  | Paragraph;
export type ObjectType =
  | Link
  | Bold
  | Italic
  | Code
  | Verbatim
  | StrikeThrough
  | Underline
  | Text
  | Timestamp
  | FootnoteReference
  | LatexFragment
  | Entity
  | TableCell;

export type OrgNode = GreaterElementType | ElementType | ObjectType;

export interface OrgData extends GreaterElement {
  type: 'org-data';
  children: Array<Section | Headline>;
}

export interface Headline extends GreaterElement {
  type: 'headline';
  level: number;
  todoKeyword: string | null;
  priority: string | null;
  commented: boolean;
  rawValue: string;
  title: ObjectType[];
  tags: string[];
  children: Array<Section | Headline>;
}

export interface Planning extends Node {
  type: 'planning';
  closed: Timestamp | null;
  deadline: Timestamp | null;
  scheduled: Timestamp | null;
}

export interface Drawer extends GreaterElement, WithAffiliatedKeywords {
  type: 'drawer';
  name: string;
}

export interface PropertyDrawer extends GreaterElement {
  type: 'property-drawer';
}

export interface NodeProperty extends Node {
  type: 'node-property';
  key: string;
  value: string;
}

export interface Section extends GreaterElement {
  type: 'section';
}

export interface HorizontalRule extends Node, WithAffiliatedKeywords {
  type: 'horizontal-rule';
}

export interface FootnoteDefinition
  extends GreaterElement,
    WithAffiliatedKeywords {
  type: 'footnote-definition';
  label: string;
}

export interface DiarySexp extends Node, WithAffiliatedKeywords {
  type: 'diary-sexp';
  /** Full Sexp */
  value: string;
}

export interface Paragraph extends Parent {
  type: 'paragraph';
}

export interface Comment extends Node {
  type: 'comment';
  /** Comments, without pound signs. */
  value: string;
}

export interface FixedWidth extends Node, WithAffiliatedKeywords {
  type: 'fixed-width';
  /** Contents, without colos prefix. */
  value: string;
}

export interface Clock extends Node {
  type: 'clock';
  // Clock duration for a closed clock
  duration: string | null;
  status: 'closed' | 'running';
  value: Timestamp | null;
}

export interface LatexEnvironment extends Node, WithAffiliatedKeywords {
  type: 'latex-environment';
  /** LaTeX code. */
  value: string;
}

export interface LatexFragment extends Node {
  type: 'latex-fragment';
  /** LaTeX code. */
  value: string;
}

export interface Entity extends Node {
  type: 'entity';
  name: string;
  useBrackets: boolean;
  latex: string;
  requireLatexMath: boolean;
  html: string;
  ascii: string;
  latin1: string;
  utf8: string;
}

export interface List extends GreaterElement {
  type: 'plain-list';
  listType: 'ordered' | 'unordered' | 'descriptive';
  indent: number;
  children: Item[];
  structure: ListStructureItem[];
}

export type ListStructureItem = {
  begin: number;
  indent: number;
  bullet: string;
  counter: string | null;
  checkbox: string | null;
  tag: string | null;
  end: number;
};

export interface Item extends GreaterElement {
  type: 'item';
  indent: number;
  tag: string | null;
}

export interface SrcBlock extends Node, WithAffiliatedKeywords {
  type: 'src-block';
  language?: string;
  value: string;
}
export interface ExampleBlock extends Node, WithAffiliatedKeywords {
  type: 'example-block';
  value: string;
}
export interface ExportBlock extends Node, WithAffiliatedKeywords {
  type: 'export-block';
  backend: string | null;
  value: string;
}
export interface QuoteBlock extends GreaterElement, WithAffiliatedKeywords {
  type: 'quote-block';
}
export interface VerseBlock extends GreaterElement, WithAffiliatedKeywords {
  type: 'verse-block';
}
export interface CenterBlock extends GreaterElement, WithAffiliatedKeywords {
  type: 'center-block';
}
export interface CommentBlock extends Node, WithAffiliatedKeywords {
  type: 'comment-block';
  value: string;
}
export interface SpecialBlock extends GreaterElement, WithAffiliatedKeywords {
  type: 'special-block';
  blockType: string;
}

export type Table = TableOrg | TableTableEl;
export interface TableOrg extends GreaterElement {
  type: 'table';
  /** Formulas associated to the table, if any. */
  tblfm: string | null;
  tableType: 'org';
}
export interface TableTableEl extends Node {
  type: 'table';
  /** Formulas associated to the table, if any. */
  tblfm: string | null;
  tableType: 'table.el';
  /** Raw `table.el` table. */
  value: string;
}

export interface TableRow extends Element {
  type: 'table-row';
  rowType: 'standard' | 'rule';
}

export interface TableCell extends RecursiveObject {
  type: 'table-cell';
}

export interface Keyword extends Node, WithAffiliatedKeywords {
  type: 'keyword';
  key: string;
  value: string;
}

export interface Text extends Object, Literal {
  type: 'text';
  value: string;
}

export interface Bold extends RecursiveObject {
  type: 'bold';
}

export interface Italic extends RecursiveObject {
  type: 'italic';
}

export interface Code extends Object {
  type: 'code';
  value: string;
}

export interface Verbatim extends Object {
  type: 'verbatim';
  value: string;
}

export interface StrikeThrough extends RecursiveObject {
  type: 'strike-through';
}

export interface Underline extends RecursiveObject {
  type: 'underline';
}

export interface Link extends RecursiveObject {
  type: 'link';
  format: 'plain' | 'bracket';
  linkType: string;
  rawLink: string;
  path: string;
}

export interface Timestamp extends Object {
  type: 'timestamp';
  timestampType:
    | 'active'
    | 'active-range'
    | 'diary'
    | 'inactive'
    | 'inactive-range';
  rawValue: string;
  start: {
    year: number;
    month: number;
    day: number;
    hour: number | null;
    minute: number | null;
  } | null;
  end: {
    year: number;
    month: number;
    day: number;
    hour: number | null;
    minute: number | null;
  } | null;
}

export interface FootnoteReference extends RecursiveObject {
  type: 'footnote-reference';
  label: string;
  footnoteType: 'inline' | 'standard';
}

type AffiliatedValue =
  | string
  | [string, string]
  | ObjectType[]
  | [ObjectType[], ObjectType[]];
export type AffiliatedKeywords = Record<
  string,
  AffiliatedValue | AffiliatedValue[]
>;
export interface WithAffiliatedKeywords {
  affiliated: AffiliatedKeywords;
}
