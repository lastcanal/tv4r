import Title from "./Title";

describe("Title", () => {
  it("should render Title", () => {
    const enzymeWrapper = mount(<Title post={{ title: "hello" }} />);

    expect(enzymeWrapper).toMatchInlineSnapshot(`
      <Title
        post={
          Object {
            "title": "hello",
          }
        }
      >
        <div
          className="makeStyles-root-1"
        >
          <a
            className="makeStyles-title-2"
          >
            hello
          </a>
        </div>
      </Title>
    `);
  });

  it("should render without title", () => {
    const enzymeWrapper = mount(<Title post={{ title: undefined }} />);

    expect(enzymeWrapper).toMatchInlineSnapshot(`
      <Title
        post={
          Object {
            "title": undefined,
          }
        }
      >
        <div
          className="makeStyles-root-1"
        >
          <a
            className="makeStyles-title-2"
          >
            <WithStyles(ForwardRef(Skeleton))>
              <ForwardRef(Skeleton)
                classes={
                  Object {
                    "animate": "MuiSkeleton-animate",
                    "circle": "MuiSkeleton-circle",
                    "rect": "MuiSkeleton-rect",
                    "root": "MuiSkeleton-root",
                    "text": "MuiSkeleton-text",
                  }
                }
              >
                <div
                  className="MuiSkeleton-root MuiSkeleton-text MuiSkeleton-animate"
                  style={
                    Object {
                      "height": undefined,
                      "width": undefined,
                    }
                  }
                />
              </ForwardRef(Skeleton)>
            </WithStyles(ForwardRef(Skeleton))>
          </a>
        </div>
      </Title>
    `);
  });

  it("should render without post", () => {
    const enzymeWrapper = mount(<Title post={undefined} />);

    expect(enzymeWrapper).toMatchInlineSnapshot(`<Title />`);
  });
});
