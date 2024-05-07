import { ServerError } from "@/utils/DTOs/common/ServerError";
import { SerializedError, isAsyncThunkAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type HandleApiCallParams<DataType, ServerError> = {
  callbackFn: () => Promise<
    { data: DataType } | { error: FetchBaseQueryError | SerializedError }
  >;
  successCallback: (data: DataType) => void;
  errorFromServerCallback: (error: ServerError) => void;
  errorSerializedCallback: (error: SerializedError) => void;
  errorCallback: (error: unknown) => void;
};

export const handleApiCall = async <DataType, ServerError>({
  callbackFn,
  successCallback,
  errorFromServerCallback,
  errorSerializedCallback,
  errorCallback,
}: HandleApiCallParams<DataType, ServerError>) => {
  try {
    // const result = await callbackFn();
    const result_ = () => callbackFn();
    const result = await result_();
    if ("data" in result) {
      successCallback(result.data);
    } else {
      const error = result.error;
      if ("status" in error) {
        errorFromServerCallback(error.data as ServerError);
      } else {
        errorSerializedCallback(error);
      }
    }
  } catch (error) {
    errorCallback(error);
  }
};

// const handleApiCall = async (
//   callbackFn: CallbackFn,
//   successCallback: SuccessCallback,
//   errorFromServerCallback: ErrorFromServerCallback,
//   errorSerializedCallback: ErrorSerializedCallback,
//   errorCallback: ErrorCallback
// ) => {
//   try {
//     const result = await callbackFn();
//     if ("data" in result) {
//       successCallback(result.data);
//     } else {
//       const error = result.error;
//       if ("status" in error) {
//         const serverError = error.data as ServerError;
//         errorFromServerCallback(serverError);
//       } else {
//         errorSerializedCallback(error);
//       }
//     }
//   } catch (error) {
//     errorCallback(error);
//   }
// };

// Use handleApiCall somewhere in your code
