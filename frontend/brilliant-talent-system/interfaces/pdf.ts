export interface PDFResultCheck {
    result: {
        "sr0": boolean,
        "sr1": boolean,
        "sr2": boolean,
        "sr3": boolean,
        "sr4": boolean
    }
    message?: "پی دی اف ها در حال ساخت می باشند ، لطفا صبور باشید" | "مشکلی در ساخت پی دی اف ها به وجود آمد، لطفا دوباره تلاش کنید"
}