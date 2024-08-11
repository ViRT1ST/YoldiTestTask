function getApiResponse(successResponse: any, errorResponse: any) {
  const apiResponse = {
    success: successResponse?.success || errorResponse?.success || false,
    code: successResponse?.code || errorResponse?.code || 500,
    data: successResponse?.data || null,
    message: errorResponse?.message || null
  };

  return apiResponse;
}

export {
  getApiResponse
};
