import { IAttribute, IAttributeValue } from "../src/interfaces/attribute.js";
import instance from "./instance"; // axios instance

export const getAllAttributes = () => instance.get("/attribute");
export const getAttributeById = (id: string) => instance.get(`/attribute/${id}`);
export const createAttribute = (data: IAttribute) => instance.post("/attribute/add", data);
export const updateAttribute = (id: string, data: IAttribute) => instance.put(`/attribute/edit/${id}`, data);
export const deleteAttribute = (id: string | number) => instance.delete(`/attribute/${id}`);

// export const getAllAttributes = () => instance.get("/attribute");

export const createAttributevalue = (data: IAttributeValue) => instance.post("/attribute-value/add", data);
export const getAttributeValueById = (attributeId: string) => instance.get(`/attribute-value/${attributeId}`);
export const getAttributeValues = (attributeId: string) => instance.get(`/attribute-value/list/${attributeId}`);
export const updateAttributeValue = (id: string, data: { value: string }) => instance.put(`/attribute-value/edit/${id}`, data);
export const deleteAttributeValue = (id: string) => instance.delete(`/attribute-value/${id}`);
