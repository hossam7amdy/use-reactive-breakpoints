import { Meta, StoryObj } from "@storybook/react-vite";
import { useReactiveBreakpoints } from "./index";

const breakpointsDemo = () => {
  const breakpoint = useReactiveBreakpoints();

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h1>breakpoint State</h1>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "1.2rem",
        }}
      >
        Resize your browser or use the Storybook viewport tool to see the
        breakpoint update in real-time.
      </p>

      <div style={{ margin: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <thead>
            <tr>
              <th>Breakpoint</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(breakpoint).map(([key, isActive]) => (
              <tr key={key}>
                <td>
                  <code>{key}</code>
                </td>
                <td>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: isActive ? "#4ade80" : "#f87171",
                      color: "white",
                    }}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const meta: Meta<typeof breakpointsDemo> = {
  title: "Hooks/useReactiveBreakpoints",
  component: breakpointsDemo,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof breakpointsDemo>;

export const Default: Story = {};
