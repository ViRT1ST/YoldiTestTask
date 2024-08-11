import { ApiResponse } from '@/lib/types';

function successResponse(code: number, data: object | null) {
  const body: ApiResponse = {
    success: true,
    code: code || 200,
    data: data || null,
    message: null
  };

  const responseInit = { status: body.code };
  return Response.json(body, responseInit);
}

function errorResponse(error: any) {
  const { name, code, message } = error;

  const body: ApiResponse = {
    success: false,
    code: code || 500,
    data: null,
    message: message || 'Server error'
  };

  if (name && name.match(/^(JsonWebTokenError|TokenExpiredError)$/)) {
    body.message = 'Token expired or invalid. Please re-authenticate.';
    body.code = 400;
  }

  if (name && name === 'ValidationError') {
    body.message = 'Invalid data provided.';
    body.code = 400;
  }

  const responseInit = { status: body.code };
  return Response.json(body, responseInit);
}

export {
  successResponse,
  errorResponse
};