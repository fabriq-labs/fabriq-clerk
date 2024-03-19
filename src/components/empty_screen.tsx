import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "who are the best performing author in july, 2023?",
    message: "who are the best performing author in july, 2023?",
  },
  {
    heading: "who are the best performing author in sep, 2023?",
    message: "who are the best performing author in sep, 2023?",
  },
  {
    heading: "who are the best performing author in dec, 2023?",
    message: "who are the best performing author in dec, 2023?",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <p className="leading-normal text-muted-foreground">Try an example:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
