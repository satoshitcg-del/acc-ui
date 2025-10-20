import PrefixService from "@/services/PrefixService";
import { useEffect, useState } from "react";

import type { IPrefixes } from "@/core/interface/services";
import { responseOfPrefixes } from "../enum";


export const useFetchPrefixes = () => {
  const { getPrefixList } = PrefixService();
  const [prefixes, setPrefixes] = useState<IPrefixes[]>([]);

  useEffect(() => {
    // fetchPrefixes()
  }, []);

  const fetchPrefixes = async () => {
    try {
      // const res: any = await getPrefixList();
      // console.log("fetchPrefixes: ,",res);
      // const checkDataNull = res?.data || []
      const checkDataNull: any = responseOfPrefixes
      setPrefixes(checkDataNull)
      return checkDataNull
    } catch (error) {
      console.error(error);
      return error
    }
  }

  return {
    prefixes,
    fetchPrefixes
  }
}