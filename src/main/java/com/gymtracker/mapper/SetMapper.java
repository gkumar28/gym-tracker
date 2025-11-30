package com.gymtracker.mapper;

import com.gymtracker.entity.Set;
import com.gymtracker.schemaobject.SetSO;

import java.util.List;
import java.util.stream.Collectors;

public class SetMapper {

    public static SetSO toSO(Set set) {
        if (set == null) {
            return null;
        }
        SetSO so = new SetSO();
        so.setReps(set.getReps());
        so.setWeight(set.getWeight());
        so.setRestSeconds(set.getRestSeconds());
        so.setNotes(set.getNotes());
        return so;
    }

    public static Set toEntity(SetSO so) {
        if (so == null) {
            return null;
        }
        Set set = new Set();
        set.setReps(so.getReps());
        set.setWeight(so.getWeight());
        set.setRestSeconds(so.getRestSeconds());
        set.setNotes(so.getNotes());
        return set;
    }

    public static List<SetSO> toSOList(List<Set> sets) {
        if (sets == null) {
            return null;
        }
        return sets.stream()
                .map(SetMapper::toSO)
                .collect(Collectors.toList());
    }

    public static List<Set> toEntityList(List<SetSO> setSOs) {
        if (setSOs == null) {
            return null;
        }
        return setSOs.stream()
                .map(SetMapper::toEntity)
                .collect(Collectors.toList());
    }
}
