export interface IAttribute {
    _id?: string;
    name: string;
    display_name: string;
    type?: 'text' | 'boolean' | 'number' | 'select';
}
export interface IAttributeValue {
    _id?: string;
    value: string;
    attribute_id: string;
}