import type { FieldApi } from "@tanstack/react-form";
import "./ListProductForm.css";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

interface ListProductFormProps {
  closeModal: () => void;
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <div className={"productDescription"}>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em style={{ color: "red" }}>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </div>
  );
}

export const ListProductForm: FC<ListProductFormProps> = ({ closeModal }) => {
  const form = useForm({
    defaultValues: {
      description: "",
      price: 0,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
      closeModal();
    },
  });

  return (
    <div
      style={{
        height: "65%",
        display: "flex",
        paddingLeft: "10%",
        paddingRight: "10%",
      }}
    >
      <style>
        {`
            /* Hide the arrows on input type="number" */
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }
            
            /* Hide the arrows in Firefox */
            input[type="number"] {
            -moz-appearance: textfield;
            }
        `}
      </style>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "60%",
          }}
        >
          {/* A type-safe field component*/}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) =>
                !value ? "A product description is required" : undefined,
              onChangeAsyncDebounceMs: 1000,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") &&
                  'No "error" allowed in product description'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name} className={"productDescription"}>
                    Product Description:
                  </label>
                  <textarea
                    style={{ height: "70%", resize: "none" }}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <form.Field
            name="price"
            validators={{
              onChange: ({ value }) =>
                !value ? "A price is required" : undefined,
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name} className="productDescription">
                  Listing Price:
                </label>
                <input
                  style={{
                    width: "10%",
                  }}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="number"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div
              style={{
                display: "flex",
                padding: "5%",
                justifyContent: "space-around",
              }}
            >
              <button
                type="submit"
                disabled={!canSubmit}
                // style={{ marginRight: "20%" }}
              >
                {isSubmitting ? "..." : "Submit"}
              </button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
};
