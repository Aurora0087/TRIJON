export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export type SearchBYCategoryParamProps = {
    params: { search: string }
    searchParams: { [key: string]: string | string[] | undefined }
}