class customError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.success = false;
  }
}
export default customError;
