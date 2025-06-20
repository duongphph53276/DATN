export interface ICategory {
    _id?: string;
    name: string;
    slug?: string;
    parent_id?: string | { _id: string; name: string } | null;
}