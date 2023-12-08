import toast from "react-hot-toast";

export function toastSuccess(message) {
    toast.success(message, {
        iconTheme: {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--primary-foreground))",
        },
        position: "top-right",
        style: {
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            boxShadow: "0 0 5px hsl(var(--border))",
        },
    });
}

export function toastError(message) {
    toast.error(message, {
        iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))",
        },
        position: "top-right",
        style: {
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            boxShadow: "0 0 5px hsl(var(--border))",
        },
    });
}

export function toastLoading(message) {
    toast.loading(message, {
        iconTheme: {
            primary: "hsl(var(--primary))",
            secondary: "hsl(var(--primary-foreground))",
        },
        position: "top-right",
        style: {
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            boxShadow: "0 0 5px hsl(var(--border))",
        },
    });
}