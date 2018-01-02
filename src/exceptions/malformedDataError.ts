class MalformedDataError {
  message:string = "";
  constructor(message:string) {
    this.message = message
  }

}

export default MalformedDataError;
