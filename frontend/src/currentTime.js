
export default (currentTimeMilis) => {
    const date = new Date(parseInt(currentTimeMilis, 10));
    return date.toUTCString();
}