"use client";

import { useEffect } from "react";

export default function DurantMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reduceMotion.matches) return;

    const cardSelector =
      ".admin-premium-card, .admin-stat-card, .admin-hero, article, [data-tilt='true']";

    const isProtected = (element: HTMLElement) =>
      !!(
        element.closest("#durant-student-sidebar, aside, .durant-welcome") ||
        element.querySelector("#durant-student-sidebar, aside")
      );

    const resetCard = (card: HTMLElement) => {
      card.style.removeProperty("transform");
      card.style.removeProperty("--durant-card-x");
      card.style.removeProperty("--durant-card-y");
    };

    let activeCard: HTMLElement | null = null;

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;

      document.documentElement.style.setProperty(
        "--durant-pointer-x",
        `${event.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--durant-pointer-y",
        `${event.clientY}px`
      );

      const target = event.target;
      if (!(target instanceof Element)) return;

      const card = target.closest<HTMLElement>(cardSelector);

      if (activeCard && activeCard !== card) {
        resetCard(activeCard);
        activeCard = null;
      }

      if (!card || isProtected(card)) {
        if (card) resetCard(card);
        return;
      }

      activeCard = card;

      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 7;
      const rotateX = (0.5 - y) * 7;

      card.style.setProperty("--durant-card-x", `${x * 100}%`);
      card.style.setProperty("--durant-card-y", `${y * 100}%`);
      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      const card = event.target.closest<HTMLElement>(cardSelector);
      if (!card) return;

      if (
        event.relatedTarget instanceof Node &&
        card.contains(event.relatedTarget)
      ) {
        return;
      }

      resetCard(card);
      if (activeCard === card) activeCard = null;
    };

    // لا نستخدم main > div حتى لا نضيف reveal إلى حاوية التخطيط
    // التي قد تحتوي القائمة الجانبية.
    const revealSelector =
      "main section, main article, .admin-premium-card, .admin-stat-card, .admin-hero";

    let revealObserver: IntersectionObserver | null = null;

    const prepareReveal = (root: ParentNode) => {
      if (!revealObserver) return;

      root.querySelectorAll(revealSelector).forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        if (isProtected(element)) return;
        if (element.dataset.durantReveal === "done") return;

        element.dataset.durantReveal = "done";
        element.classList.add("durant-reveal");
        revealObserver?.observe(element);
      });
    };

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("durant-revealed");
            revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -35px 0px" }
      );

      prepareReveal(document);

      const mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;

            prepareReveal(node);

            if (node.matches(revealSelector)) {
              prepareReveal(node.parentElement ?? document);
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      document.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      document.addEventListener("pointerout", onPointerOut);

      return () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerout", onPointerOut);
        mutationObserver.disconnect();
        revealObserver?.disconnect();

        if (activeCard) resetCard(activeCard);
        document.documentElement.style.removeProperty("--durant-pointer-x");
        document.documentElement.style.removeProperty("--durant-pointer-y");
      };
    }

    document.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      if (activeCard) resetCard(activeCard);
    };
  }, []);

  return null;
}
