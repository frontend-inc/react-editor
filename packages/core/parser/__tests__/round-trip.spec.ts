import { parse } from "../parse";
import { serialize } from "../serialize";

const Hero = () => null;
const CTA = () => null;
const Page = () => null;
const Section = () => null;
const Columns = () => null;
const Box = () => null;
const Team = () => null;
const TeamCard = () => null;

const components = {
  Hero,
  CTA,
  Page,
  Section,
  Columns,
  Box,
  Team,
  TeamCard,
};

describe("parser round-trip", () => {
  test("self-closing element", () => {
    const out = serialize(parse(`<Hero title="hi" />`, { components }));
    expect(out).toMatch(/<Hero title="hi"( \/|\/)>/);
  });

  test("nested children with text", () => {
    const out = serialize(
      parse(`<Section><Hero title="a" /></Section>`, { components })
    );
    expect(out).toMatch(/<Section>/);
    expect(out).toMatch(/<Hero title="a"\s*\/>/);
    expect(out).toMatch(/<\/Section>/);
  });

  test("named slot as attribute JSX", () => {
    const out = serialize(
      parse(`<Columns left={<Hero title="L" />} right={<CTA />} />`, {
        components,
      })
    );
    expect(out).toMatch(/left=\{<Hero title="L"\s*\/>\}/);
    expect(out).toMatch(/right=\{<CTA\s*\/>\}/);
  });

  test("numeric / boolean / null props", () => {
    const out = serialize(
      parse(`<Hero count={3} active={true} empty={null} />`, { components })
    );
    expect(out).toMatch(/count=\{3\}/);
    // boolean true serializes as JSX shorthand attribute.
    expect(out).toMatch(/active(?![a-zA-Z])/);
    expect(out).toMatch(/empty=\{null\}/);
  });

  test("object prop", () => {
    const out = serialize(
      parse(`<Hero cta={{ label: "Go", href: "/" }} />`, { components })
    );
    expect(out).toMatch(/cta=\{\{/);
    expect(out).toMatch(/label: "Go"/);
    expect(out).toMatch(/href: "\/"/);
  });

  test("array prop", () => {
    const out = serialize(parse(`<Hero items={[1, 2, 3]} />`, { components }));
    expect(out).toMatch(/items=\{\[1, 2, 3\]\}/);
  });

  test("array of jsx props → slot with multiple children", () => {
    const out = serialize(
      parse(`<Columns left={[<Hero title="a" />, <Hero title="b" />]} />`, {
        components,
      })
    );
    expect(out).toMatch(/left=\{\[/);
  });

  test("text children preserved", () => {
    const out = serialize(parse(`<Hero>Hello world</Hero>`, { components }));
    expect(out).toMatch(/Hello world/);
  });

  test("lowercase (html) tag is a parse error", () => {
    expect(() => parse(`<div>hi</div>`, { components })).toThrow(
      /isn't allowed in authoring JSX/
    );
  });

  test("unknown capitalized tag is a parse error", () => {
    expect(() => parse(`<Unknown />`, { components })).toThrow(
      /isn't a registered component/
    );
  });

  test("spread attribute is rejected", () => {
    expect(() =>
      parse(`<Hero {...props} />`, { components })
    ).toThrow(/Spread attributes/);
  });

  test("arbitrary expression in props is rejected", () => {
    expect(() =>
      parse(`<Hero title={someVar} />`, { components })
    ).toThrow(/Unsupported expression/);
  });

  test("top-level fragment unwraps to node list", () => {
    const nodes = parse(`<><Hero /><CTA /></>`, { components });
    expect(Array.isArray(nodes)).toBe(true);
  });

  test("block jsx nested structure round-trips", () => {
    const input = `
      <Team>
        <TeamCard name="Riley" title="Founder" />
        <TeamCard name="Sam" title="Design" />
      </Team>
    `;
    const out = serialize(parse(input, { components }));
    // Snapshot key substrings rather than exact whitespace.
    expect(out).toMatch(/<Team>/);
    expect(out).toMatch(/<TeamCard name="Riley" title="Founder"\s*\/>/);
    expect(out).toMatch(/<TeamCard name="Sam" title="Design"\s*\/>/);
    expect(out).toMatch(/<\/Team>/);
  });

  test("re-parse after serialize produces structurally equivalent tree", () => {
    const input = `<Page title="Home"><Section><Hero title="a" /></Section></Page>`;
    const firstTree = parse(input, { components });
    const firstStr = serialize(firstTree);
    const secondTree = parse(firstStr, { components });
    const secondStr = serialize(secondTree);
    expect(secondStr).toBe(firstStr);
  });

  test("nodes get unique ids", () => {
    const input = `<Section><Hero /><Hero /></Section>`;
    const tree = parse(input, { components });
    const root = Array.isArray(tree) ? tree[0] : tree;
    const heroes = root.slots.children ?? [];
    expect(heroes).toHaveLength(2);
    if (typeof heroes[0] !== "string" && typeof heroes[1] !== "string") {
      expect(heroes[0].id).not.toBe(heroes[1].id);
    }
  });
});
