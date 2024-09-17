import type { Node } from "./Node";

export interface PathRequest {
  getSource(): Node;
  getDest(): Node;
}
