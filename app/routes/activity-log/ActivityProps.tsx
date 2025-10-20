export interface ColumnActivity {
    columnId: "id" | "username" | "createAt" | "path" | "message" | "type" | "method";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    align?: "right" | 'center' | 'left';
    bodyAlign?: "right" | 'center' | 'left';
    format?: (value: number) => string;
}