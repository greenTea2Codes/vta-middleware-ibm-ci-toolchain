exports.derive_reference_id = (question_id) => {
    let ref_id = null;
    const ref_id_regex = /^[1-9]+\.[1-9]+/g;
    if ( question_id ) {
        let matches = question_id.match(ref_id_regex);
        ref_id = matches && matches.length > 0 ? matches[0] : null;
    }
    return ref_id;
};
