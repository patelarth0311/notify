import { Document } from "../requests";
import { useContext } from "react";
import { useAppDispatch, appendToast } from "./store";

export const useToast = () => {
  var dispatch = useAppDispatch();

  const makeToast = (document: Document) => {
    dispatch(appendToast({ toast: document }));
  };

  return { makeToast };
};
