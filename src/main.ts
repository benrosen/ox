import ox from "./ox";

export default () => {
  const o = new ox({ clock: { hertz: 2, range: { max: Infinity, min: 0 } } });
  o.roster.events.onPlayerAdded.subscribe((event) =>
    event.data.input.events.onStartMoveUp.subscribe((event) =>
      console.log(event)
    )
  );
  o.roster.add("ben");
  o.clock.events.onChange.subscribe((event) =>
    console.log(event.data.counter.count)
  );
  o.clock.start();
};
