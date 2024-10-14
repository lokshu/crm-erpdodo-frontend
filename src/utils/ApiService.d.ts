interface Label {
    labelDefault: string;
    content: string;
}
declare const _default: {
    getVerifyUser(): Promise<number>;
    getLabels(): Promise<Record<string, Label>>;
    getLabelsForPage(module: string): Promise<Record<string, Label>>;
    getTransformLabels(module: string): Promise<Record<string, string>>;
};
export default _default;
