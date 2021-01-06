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
  contentsBegin: number;
  contentsEnd: number;
  children: Array<ObjectType>;
}
export interface Object extends Node {}

export type GreaterElementType =
  | OrgData
  | Headline
  | Section
  | List
  | Item
  | QuoteBlock
  | SpecialBlock;
export type ElementType = SrcBlock | Keyword | Paragraph;
export type ObjectType = Link | Text;

export type OrgNode = GreaterElementType | ElementType | ObjectType;

export interface OrgData extends GreaterElement {
  type: 'org-data';
  children: Array<Section | Headline>;
}

export interface Headline extends GreaterElement {
  type: 'headline';
  level: number;
  title: ObjectType[];
  children: Array<Section | Headline>;
}

export interface Section extends GreaterElement {
  type: 'section';
}

export interface Paragraph extends Parent {
  type: 'paragraph';
}

export interface List extends GreaterElement {
  type: 'plain-list';
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
}

export interface SrcBlock extends Node {
  type: 'src-block';
  language?: string;
  value: string;
}

export interface QuoteBlock extends GreaterElement {
  type: 'quote-block';
}

export interface SpecialBlock extends GreaterElement {
  type: 'special-block';
  blockType: string;
}

export interface Keyword extends Node {
  type: 'keyword';
  key: string;
  value: string;
}

export interface Text extends Object, Literal {
  type: 'text';
  value: string;
}

export interface Link extends Object {
  type: 'link';
  linkType: string;
  rawLink: string;
  children: ObjectType[];
}
