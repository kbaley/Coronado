export function NullableDate({date}) {
  return (
    date ? new Date(date).toLocaleDateString() : ""
  );
}

