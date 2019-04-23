/// <reference types="react" />
import { CustomLink } from './link';
export declare function useLink<S>(initialState: S | (() => S)): CustomLink<import("react").SetStateAction<S>>;
