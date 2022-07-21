import ListItem from "./ListItem";

export default function List({ items }) {
  return (
    <>
      {items.forEacch((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </>
  );
}
