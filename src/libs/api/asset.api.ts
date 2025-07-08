import { GetAsset_DTO, AddAsset_DTO, UpAsset_DTO } from '@/models/asset.model';
import { CallApi } from '@/libs/call_API';
import axios from 'axios';

export const assetAPI = {
  getAllasset: async () => {
    const data: GetAsset_DTO[] = await CallApi.getAll<GetAsset_DTO>('asset');
    return data;
  },

  getassetByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    AssetStatust?: string,
    divisionId?:number,
    assetName?:string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });
    if (divisionId) {
      queryParams.append('divisionId', divisionId.toString());
    }

    if (AssetStatust) {
      queryParams.append('AssetStatust', AssetStatust);
    }

    if (assetName) {
      queryParams.append('assetName', assetName);
    }

    const data: GetAsset_DTO[] = await CallApi.getAll<GetAsset_DTO>(
      `asset?${queryParams.toString()}`,
    );

    return data;
  },

  createasset: async (newasset: AddAsset_DTO) => {
    const data = await CallApi.create<number>('asset', newasset);
    return data;
  },

  updateasset: async (asset: UpAsset_DTO) => {
    const data = await CallApi.update<number>('asset', asset);
    return data;
  },

  deleteasset: async (Id: string): Promise<number> => {
    const data = await CallApi.delete<number>('asset', Id); 
    return data;
}

};
