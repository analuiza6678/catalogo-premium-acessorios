import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] bg-bege px-6 py-14 text-center">
      <ShoppingBag className="mb-4 text-dourado" size={34} />
      <h3 className="font-serif text-2xl text-preto">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-texto">{description}</p> : null}
      {action ? (
        <Button className="mt-6" type="button" onClick={onAction}>
          {action}
        </Button>
      ) : null}
    </div>
  );
}
