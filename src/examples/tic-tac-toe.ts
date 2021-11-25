// TODO implement
// TODO document
// TODO test
(() => {
  const setTokens = new PublicTopic<Set<Token>>();
  const tokens = new ProtectedVariable<Set<Token>>(setTokens);
  const board = new Grid([3, 3], tokens);
  const hasEvenPlayerWon = new PublicVariable<boolean | null | undefined>();
  const middleCell = Array.from(board.cells).find(
    (cell) => cell.coordinates === [1, 1]
  )!;
  tokens.onChange.subscribe(
    () =>
      (hasEvenPlayerWon.value = [
        ...board.columns,
        ...board.rows,
        middleCell.negativeDiagonal,
        middleCell.positiveDiagonal,
      ].some((line) =>
        Array.from(line).every((cell) =>
          isEven(
            Array.from(tokens.value).findIndex(
              (token) => token.cell.value === cell
            )
          ) === isEven(tokens.value.size)
            ? isEven(tokens.value.size)
            : tokens.value.size === 9
            ? null
            : undefined
        )
      ))
  );
})();
