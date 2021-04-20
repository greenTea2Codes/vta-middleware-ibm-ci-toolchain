class GenericResponse {
    constructor(res_type, msg, preview_link) {
        this.response_type = res_type;
        this.message = msg;
        this.preview_link = preview_link;
    }
}
module.exports = GenericResponse;
