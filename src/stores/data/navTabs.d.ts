export const useTabsStore: import("pinia").StoreDefinition<"tabs", {
    tabs: never[];
}, {}, {
    addTab(tab: any): void;
    removeTab(index: any): void;
}>;
