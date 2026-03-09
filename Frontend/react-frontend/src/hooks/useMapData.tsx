
import { useQuery } from '@tanstack/react-query';


export const useMapData  = (position: {lat : number, lng : number}, ) => {

  const adressQuery  =  useQuery( {
    queryKey : ["mapLocation",position.lat, position.lng],
    queryFn : async () =>{ 
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.lat}&longitude=${position.lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    {
      getAdress : adressQuery.data,
      isLoading : adressQuery.isLoading,
      error : adressQuery.error
    }
  );
};